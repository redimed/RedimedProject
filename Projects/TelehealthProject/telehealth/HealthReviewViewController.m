//
//  ViewController.m
//  HealthReview
//
//  Created by Hung Cao Thanh on 3/7/15.
//  Copyright (c) 2015 HungCao. All rights reserved.
//

#import "HealthReviewViewController.h"
#import "Constants.h"
#import "AKTagsDefines.h"
#import "AKTagsInputView.h"
#import "MBProgressHUD.h"
#import "rteleWebserviceManager.h"
#import "SBJson.h"
#import "NSDataAdditions.h"

@interface HealthReviewViewController () <UICollectionViewDataSource, UICollectionViewDelegate, UINavigationControllerDelegate, UIImagePickerControllerDelegate, UITextFieldDelegate,UITextViewDelegate>{
    NSMutableArray *arrImageCollection;
    UICollectionView *mainCollectionView;
    
    //
    AKTagsInputView *_tagsInputView;
    BOOL isScrollViewFirst;
    
    //review image
    UIView *reviewImageView;
    
    //data
    UITextField *dateTextField;
    UITextField *timeTextField;
    UITextField *consultTextField;
    UITextField *locationTextField;
    UITextView *assisstantTextView;
    
    //dict data
    NSMutableDictionary *mainDictionaryData;
    //check view
    BOOL isView;
}

@property (nonatomic, strong) UIPopoverController *popOverViewController;
@property (nonatomic, strong) UIScrollView *mainScrollView;

@end

@implementation HealthReviewViewController

-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    self.title = @"Health Review";
    
}

-(void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    [self.mainScrollView setContentOffset:CGPointMake(0, 0) animated:NO];
}
- (void)viewDidLoad {
    [super viewDidLoad];
    isScrollViewFirst = TRUE;
    [self.view setBackgroundColor:[UIColor whiteColor]];
    // Do any additional setup after loading the view, typically from a nib.
//    [self.mainScrollView setContentOffset:CGPointMake(0, 0) animated:NO];
    arrImageCollection = [[NSMutableArray alloc] init];
    [arrImageCollection addObject:[UIImage imageNamed:@"insertImage"]];
    
    
    //Register notification when keyboard show || hide
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillShow:)
                                                 name:UIKeyboardDidShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillHide)
                                                 name:UIKeyboardDidHideNotification object:nil];
    
    self.mainScrollView = nil;
    //Generate collection view
    self.mainScrollView = [self setupScrollView];
    [self.view addSubview:self.mainScrollView];
    [self.mainScrollView setContentOffset:CGPointMake(0, 0)];
}


- (UIScrollView *) setupScrollView{
    UIScrollView *scrollView = [[UIScrollView alloc] initWithFrame:CGRectMake(0, 64, self.view.frame.size.width, self.view.frame.size.height)];
    [scrollView setUserInteractionEnabled:YES];
    //Set CollectionView
    
    UILabel *titleImage = [[UILabel alloc] initWithFrame:CGRectMake(20, 0, self.view.frame.size.width/2, 40)];
    [titleImage setText:@"Images:"];
    [titleImage setTextColor:[UIColor blackColor]];
    [titleImage setFont:[UIFont systemFontOfSize:17.0]];
    [scrollView addSubview:titleImage];
    
    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
    [layout setScrollDirection:UICollectionViewScrollDirectionHorizontal];
    static NSString *identifierString = @"identifierCollectionCell";
    mainCollectionView = nil;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        mainCollectionView = [[UICollectionView alloc] initWithFrame:CGRectMake(20, titleImage.frame.size.height + titleImage.frame.origin.y + 10, self.view.frame.size.width - 40, HEIGHT_CELL + 10) collectionViewLayout:layout];
    }else{
        mainCollectionView = [[UICollectionView alloc] initWithFrame:CGRectMake(20, titleImage.frame.size.height + titleImage.frame.origin.y + 10, self.view.frame.size.width - 40, HEIGHT_CELL_IPHONE + 10) collectionViewLayout:layout];
    }
    [mainCollectionView registerClass:[UICollectionViewCell class] forCellWithReuseIdentifier:identifierString];
    [mainCollectionView setDataSource:self];
    [mainCollectionView setDelegate:self];
    [mainCollectionView setBackgroundColor:[UIColor colorWithRed:133/255.0 green:151/255.0 blue:170/255.0 alpha:1.0]];
    [scrollView addSubview:mainCollectionView];
    
    //Date
    UIView *dateView = [[UIView alloc] initWithFrame:CGRectMake(20, mainCollectionView.frame.size.height + mainCollectionView.frame.origin.y + 10, mainCollectionView.frame.size.width, 40)];
    //213. 224. 240
    [dateView setBackgroundColor:[UIColor colorWithRed:213/255.0 green:224/255.0 blue:240/255.0 alpha:1.0]];
    [scrollView addSubview:dateView];
    
    UILabel *dateTitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, 5, 50, 30)];
    [dateTitleLabel setText:@"Date: "];
    [dateTitleLabel setTextColor:[UIColor blackColor]];
    
    [dateView addSubview:dateTitleLabel];
    
    dateTextField = [[UITextField alloc] initWithFrame:CGRectMake(dateTitleLabel.frame.size.width + dateTitleLabel.frame.origin.x + 5, dateTitleLabel.frame.origin.y, dateView.frame.size.width - 20 - 5 - dateTitleLabel.frame.size.width - dateTitleLabel.frame.origin.x, dateTitleLabel.frame.size.height)];;
    [dateTextField setBorderStyle:UITextBorderStyleRoundedRect];
    [dateTextField setDelegate:self];
    [dateTextField setTag:1];
    [dateView addSubview:dateTextField];
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"EEE, dd MMMM yyyy"];
    [dateTextField setText:[dateFormatter stringFromDate:[NSDate date]]];
    
    //Time view
    UIView *timeView = [[UIView alloc] initWithFrame:CGRectMake(20, dateView.frame.size.height + dateView.frame.origin.y, dateView.frame.size.width, dateView.frame.size.height)];
    [scrollView addSubview:timeView];
    
    UILabel *timeTitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, 5, 50, 30)];
    [timeTitleLabel setText:@"Time: "];
    
    [timeTitleLabel setTextColor:[UIColor blackColor]];
    [timeView addSubview:timeTitleLabel];
    
    timeTextField = [[UITextField alloc] initWithFrame:CGRectMake(timeTitleLabel.frame.size.width + timeTitleLabel.frame.origin.x + 5, timeTitleLabel.frame.origin.y, timeView.frame.size.width - 20 - 5 - timeTitleLabel.frame.size.width - timeTitleLabel.frame.origin.x, timeTitleLabel.frame.size.height)];
    [timeTextField setBorderStyle:UITextBorderStyleRoundedRect];
    [timeTextField setDelegate:self];
    //    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"h:mm a"];
    [timeTextField setTag:2];
    [timeTextField setText:[dateFormatter stringFromDate:[NSDate date]]];
    [timeView addSubview:timeTextField];
    
    //consult
    UIView *consultView = [[UIView alloc] initWithFrame:CGRectMake(20, timeView.frame.size.height + timeView.frame.origin.y, timeView.frame.size.width, timeView.frame.size.height *2)];
    [consultView setBackgroundColor:[UIColor colorWithRed:210/255.0 green:222/255.0 blue:237/255.0 alpha:1.0]];
    [scrollView addSubview:consultView];
    
    UILabel *consultTitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, 5, 100, 30)];
    [consultTitleLabel setText:@"Consult: "];
    
    [consultTitleLabel setTextColor:[UIColor blackColor]];
    [consultView addSubview:consultTitleLabel];
    
    consultTextField = [[UITextField alloc] initWithFrame:CGRectMake(consultTitleLabel.frame.size.width + consultTitleLabel.frame.origin.x + 5, consultTitleLabel.frame.origin.y, consultView.frame.size.width - 20 - 5 - consultTitleLabel.frame.size.width - consultTitleLabel.frame.origin.x, consultTitleLabel.frame.size.height)];
    [consultTextField setTag:3];
    [consultTextField setText:@"Initial"];
    [consultTextField setDelegate:self];
    [consultTextField setBorderStyle:UITextBorderStyleRoundedRect];
    [consultView addSubview:consultTextField];
    
    
    //operation item code
    UIView *operationView = [[UIView alloc] initWithFrame:CGRectMake(20, consultView.frame.size.height + consultView.frame.origin.y, consultView.frame.size.width, consultView.frame.size.height)];
    [scrollView addSubview:operationView];
    
    
    UILabel *operationTitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, 5, 200, 30)];
    [operationTitleLabel setText:@"Operation item codes: "];
    [operationTitleLabel setTextColor:[UIColor blackColor]];
    [operationView addSubview:operationTitleLabel];
    
    //Textfield
    _tagsInputView = [[AKTagsInputView alloc] initWithFrame:CGRectMake(20, operationTitleLabel.frame.size.height + operationTitleLabel.frame.origin.y, operationView.frame.size.width - 40, operationView.frame.size.height - operationTitleLabel.frame.size.height - operationTitleLabel.frame.origin.y - 5)];
    _tagsInputView.enableTagsLookup = YES;
    [_tagsInputView.selectedTags setArray:[mainDictionaryData objectForKey:@"itemcodes"]];
    [operationView addSubview:_tagsInputView];
    
    //location view
    UIView *locationView = [[UIView alloc] initWithFrame:CGRectMake(20, operationView.frame.size.height + operationView.frame.origin.y, operationView.frame.size.width , operationView.frame.size.height/2)];
    //209,221,234
    [locationView setBackgroundColor:[UIColor colorWithRed:209/255.0 green:221/255.0 blue:234/255.0 alpha:1.0]];
    [scrollView addSubview:locationView];
    
    UILabel *locationTitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, 5, 90, 30)];
    [locationTitleLabel setText:@"Location: "];
    [locationTitleLabel setTextColor:[UIColor blackColor]];
    [locationView addSubview:locationTitleLabel];
    
    locationTextField = [[UITextField alloc] initWithFrame:CGRectMake(locationTitleLabel.frame.size.width + locationTitleLabel.frame.origin.x + 5, locationTitleLabel.frame.origin.y, locationView.frame.size.width - 20 - 5 - locationTitleLabel.frame.size.width - locationTitleLabel.frame.origin.x, consultTitleLabel.frame.size.height)];
    [locationTextField setTag:5];
    [locationTextField setText:@"HPH"];
    [locationTextField setDelegate:self];
    [locationTextField setBorderStyle:UITextBorderStyleRoundedRect];
    [locationView addSubview:locationTextField];
    
    //Assistant
    
    UIView *assisstantView = [[UIView alloc] initWithFrame:CGRectMake(20, locationView.frame.size.height + locationView.frame.origin.y, locationView.frame.size.width, operationView.frame.size.height + 40)];
    [scrollView addSubview:assisstantView];
    
    UILabel *assisstantTitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, 5, 100, 30)];
    [assisstantTitleLabel setText:@"Assisstant: "];
    [assisstantTitleLabel setTextColor:[UIColor blackColor]];
    [assisstantView addSubview:assisstantTitleLabel];
    
    assisstantTextView = [[UITextView alloc] initWithFrame:CGRectMake(20, assisstantTitleLabel.frame.size.height + assisstantTitleLabel.frame.origin.y , assisstantView.frame.size.width - 40, assisstantView.frame.size.height - assisstantTitleLabel.frame.size.height - assisstantTitleLabel.frame.origin.y - 5)];
    [assisstantTextView setDelegate:self];
    [assisstantView addSubview:assisstantTextView];
    [assisstantTextView.layer setBorderWidth:1.0];
    [assisstantTextView.layer setBorderColor:[[UIColor grayColor] CGColor]];
    [assisstantTextView.layer setCornerRadius:5.0];
    
    if (!isView) {
        [assisstantTextView setEditable:NO];
    }
    if (!isView) {
    }else{
        scrollView.contentSize = CGSizeMake(scrollView.frame.size.width, assisstantView.frame.size.height + assisstantView.frame.origin.y + 100);
        
        //Load data
        //Load Image from internet
        if (!arrImageCollection) {
            arrImageCollection = [[NSMutableArray alloc] init];
        }
        dispatch_queue_t myQueue = dispatch_queue_create("HungCao.GetImage", 0);
        dispatch_async(myQueue, ^{
            NSArray *arr = [mainDictionaryData objectForKey:@"images"];
            for (NSString *linkString in arr) {
                UIImage *image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:linkString]];
                if (image) {
                    [arrImageCollection addObject:image];
                }
            }
            dispatch_async(dispatch_get_main_queue(), ^{
                //            __weak typeof(self) weakSelf = self;
                [mainCollectionView reloadData];
            });
        });
        
        dispatch_async(dispatch_get_main_queue(), ^{
            [assisstantTextView setText:[mainDictionaryData valueForKey:@"assisstantData"]];
            [consultTextField setText:[mainDictionaryData valueForKey:@"consultData"]];
            [dateTextField setText:[mainDictionaryData valueForKey:@"dateData"]];
            [timeTextField setText:[mainDictionaryData valueForKey:@"timeData"]];
        });
    }
    return scrollView;
}
-(void)dealloc{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardDidShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardDidHideNotification object:nil];
}

#pragma mark - UICollectionViewDataSource
-(NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView{
    return 1;
}
-(NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{
    return arrImageCollection.count;
}
-(UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    static NSString *identifierString = @"identifierCollectionCell";
    UICollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:identifierString forIndexPath:indexPath];
    
    for (UIView *view in cell.subviews) {
        [view removeFromSuperview];
    }
    UIImageView *imageView= [[UIImageView alloc] initWithFrame:cell.bounds];
    [imageView setImage:[arrImageCollection objectAtIndex:indexPath.row]];
    [imageView setContentMode:UIViewContentModeCenter]; //133, 151, 170
    [imageView setContentMode:UIViewContentModeScaleAspectFit];
    [cell addSubview:imageView];
    
    return cell;
}

#pragma mark – UICollectionViewDelegateFlowLayout
// 1
- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPhone) {
        return CGSizeMake(WIDTH_CELL_IPHONE, HEIGHT_CELL_IPHONE);
    }
    return CGSizeMake(WIDHT_CELL,HEIGHT_CELL);
}

// 3
- (UIEdgeInsets)collectionView:
(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout insetForSectionAtIndex:(NSInteger)section {
    //Image
    return UIEdgeInsetsMake(5, 5, 5, 5);
}

#pragma mark - UICollectionViewDelegate

-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath{
    if (indexPath.row == 0) {
    }else{ //view image
        if (!reviewImageView) {
            reviewImageView = [[UIView alloc] initWithFrame:CGRectMake(0, 64, self.view.frame.size.width, self.view.frame.size.height)];
            [reviewImageView setBackgroundColor:[UIColor whiteColor]];
            [self.view addSubview:reviewImageView];
            
            UIButton *closeButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
            [closeButton setTitle:@"Close" forState:UIControlStateNormal];
            [closeButton setFrame:CGRectMake(self.view.frame.size.width -120, 5, 100 , 30)];
            [closeButton addTarget:self action:@selector(closeBackgroundButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
            [reviewImageView addSubview:closeButton];
            
            //image view
            UIImageView *imageView = [[UIImageView alloc] initWithFrame:CGRectMake(10, closeButton.frame.size.height + closeButton.frame.origin.y , reviewImageView.frame.size.width - 20, reviewImageView.frame.size.height - closeButton.frame.size.height - 10 - closeButton.frame.origin.y)];
            [imageView setImage:[arrImageCollection objectAtIndex:(indexPath.row)]];
            [imageView setContentMode:UIViewContentModeScaleAspectFit];
            [reviewImageView addSubview:imageView];
        }
    }
}

- (void) closeBackgroundButtonClicked:(UIButton *) button{
    [reviewImageView removeFromSuperview];
    reviewImageView = nil;
}

#pragma mark - UIImagePickerControllerDelegate
-(void)imagePickerController:(UIImagePickerController *)picker didFinishPickingImage:(UIImage *)image editingInfo:(NSDictionary *)editingInfo{
    NSLog(@"\n %s \n",__func__);
}
-(void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info{
    NSLog(@"\n %s \n",__func__);
    
    [picker dismissViewControllerAnimated:YES completion:nil];
    
    UIImage *image = [info objectForKey:@"UIImagePickerControllerOriginalImage"];
    [arrImageCollection addObject:image];
    [mainCollectionView reloadData];
    
    
}
-(void)imagePickerControllerDidCancel:(UIImagePickerController *)picker{
    [picker dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark - TypePhotoPickerViewControllerDelegate
-(void)selectedItemPhotoPicker:(NSInteger)index{
    NSLog(@"\n %s - Selected: %ld\n",__func__,(long)index);
    [_popOverViewController dismissPopoverAnimated:YES];
    _popOverViewController = nil;
    
    if (index == 0) {
        [self camera];
    }else{
        [self photo];
    }
}

- (void) backgroundButtonClick:(UIButton *) sender{
    [sender removeFromSuperview];
}

- (void) cameraButtonClicked:(UIButton *) button{
    [button.superview removeFromSuperview];
    [self camera];
}
-(void) photolibraryButtonClicked:(UIButton *) button{
    [button.superview removeFromSuperview];
    [self photo];
}

- (void) camera{
    if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]) {
        UIImagePickerController * picker = [[UIImagePickerController alloc] init];
        picker.delegate = self;
        picker.sourceType = UIImagePickerControllerSourceTypeCamera;
        [self presentViewController:picker animated:YES completion:nil];
    }
}
- (void) photo{
    if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypePhotoLibrary]) {
        UIImagePickerController * picker = [[UIImagePickerController alloc] init];
        picker.delegate = self;
        picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
        [self presentViewController:picker animated:YES completion:nil];
    }
}


-(void) keyboardWillShow:(NSNotification *) notf{
    
    if (isScrollViewFirst) {
        [self.mainScrollView setContentOffset:CGPointMake(0, self.mainScrollView.contentOffset.y +  250) animated:YES];
    }
}
-(void) keyboardWillHide{
//    [UIView animateWithDuration:0.5 delay:0.0 options:UIViewAnimationOptionCurveEaseOut animations:^{
//        [self.mainScrollView setFrame:CGRectMake(self.mainScrollView.frame.origin.y, - 50, self.mainScrollView.frame.size.width, self.mainScrollView.frame.size.height)];
//    } completion:nil];
    if (isScrollViewFirst) {
        [self.mainScrollView setContentOffset:CGPointMake(0, 0) animated:YES];
    }
}
#pragma mark - UITextFieldDelegate

- (BOOL)textFieldShouldBeginEditing:(UITextField *)textField {
    return NO;
}



-(BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text{
    if ([text isEqualToString:@"\n"]) {
        [textView resignFirstResponder];
    }
    return YES;
}

-(void)dataForView:(NSMutableDictionary *)dictData{
    NSLog(@"\n DictData: %@",dictData);
    mainDictionaryData = dictData;
    isView = TRUE;
}
@end
